'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

interface AudioFile {
  data: string;
  name: string;
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimeRef = useRef(0)
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const record = useRef<any>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    }
    getUser()
  }, [supabase, router])

  useEffect(() => {
    const storedAudioFiles = JSON.parse(localStorage.getItem('audioFiles') || '[]')
    setAudioFiles(storedAudioFiles)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const startRecording = () => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F4A85',
        progressColor: '#383351',
      })

      record.current = wavesurfer.current.registerPlugin(RecordPlugin.create())

      record.current.on('record-end', (blob: Blob) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result as string
          const now = new Date()
          const date = now.toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' })
          const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
          const duration = formatTime(recordingTimeRef.current)
          const name = `Recording ${date} ${time} (${duration})`

          const newAudioFile = { data: base64data, name };
          const newAudioFiles = [newAudioFile, ...audioFiles]
          setAudioFiles(newAudioFiles)
          localStorage.setItem('audioFiles', JSON.stringify(newAudioFiles))
          recordingTimeRef.current = 0
          setRecordingTime(0)
        }
      })

      record.current.startRecording()
      setIsRecording(true)

      timerIntervalRef.current = setInterval(() => {
        recordingTimeRef.current += 1
        setRecordingTime(recordingTimeRef.current)
      }, 1000)

      stopTimeoutRef.current = setTimeout(() => {
        stopRecording()
      }, 180000) // 3 minutes
    }
  }

  const stopRecording = () => {
    if (record.current) {
      record.current.stopRecording()
      setIsRecording(false)
      if (wavesurfer.current) {
        wavesurfer.current.destroy()
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current)
      }
    }
  }

  const removeAudio = (index: number) => {
    const newAudioFiles = [...audioFiles]
    newAudioFiles.splice(index, 1)
    setAudioFiles(newAudioFiles)
    localStorage.setItem('audioFiles', JSON.stringify(newAudioFiles))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <button 
            onClick={handleLogout} 
            className="py-2 px-4 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        {user && <p className="text-center text-gray-600 dark:text-gray-300">Welcome, {user.email}</p>}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Record Audio</h2>
          <div ref={waveformRef} className="mt-4"></div>
          <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
            <span>{formatTime(recordingTime)}</span> / <span>03:00</span>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full py-3 px-4 font-bold text-white rounded-lg ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recorded Audio</h2>
          <div className="mt-4 space-y-2">
            {audioFiles.map((audioFile, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-600 p-2 rounded-lg">
                <p>{audioFile.name}</p>
                <audio src={audioFile.data} controls />
                <button 
                  onClick={() => removeAudio(index)}
                  className="py-1 px-3 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

