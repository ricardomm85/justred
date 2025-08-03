'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [audioFiles, setAudioFiles] = useState<string[]>([])

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

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    setMediaRecorder(recorder)
    recorder.start()
    setIsRecording(true)

    recorder.ondataavailable = (event) => {
      setAudioChunks((prev) => [...prev, event.data])
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = () => {
        const base64data = reader.result as string
        const newAudioFiles = [...audioFiles, base64data]
        setAudioFiles(newAudioFiles)
        localStorage.setItem('audioFiles', JSON.stringify(newAudioFiles))
        setAudioChunks([])
      }
    }
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
                <p>Recording {index + 1}</p>
                <audio src={audioFile} controls />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}