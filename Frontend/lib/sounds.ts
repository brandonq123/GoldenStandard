// Sound URLs
const SOUND_URLS = {
  startup: '/sounds/startup.mp3',
}

// Single audio instance for startup sound
let startupAudio: HTMLAudioElement | null = null

export const playStartupSound = () => {
  if (typeof window === 'undefined') return // Don't run on server

  // Create new audio instance if needed
  if (!startupAudio) {
    startupAudio = new Audio(SOUND_URLS.startup)
    startupAudio.volume = 0.8
  }

  // Play the sound
  startupAudio.currentTime = 0
  startupAudio.play()
    .then(() => console.log('🔊 Sound played successfully'))
    .catch(error => console.error('Sound playback failed:', error))
} 