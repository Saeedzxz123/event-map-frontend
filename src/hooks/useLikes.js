import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'

export const useLikes = (eventId, token) => {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadLikes = async () => {
      try {
        const res = await axios.get(`${API_URL}/likes/${eventId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        if (isMounted) {
          setLikes(res.data.count)
          setLiked(res.data.liked)
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadLikes()

    return () => {
      isMounted = false
    }
  }, [eventId, token])

  const toggleLike = async () => {
    if (!token) return alert('Login first')

    const res = await axios.post(
      `${API_URL}/likes/${eventId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setLiked(res.data.liked)

    const countRes = await axios.get(`${API_URL}/likes/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setLikes(countRes.data.count)
  }

  return { likes, liked, toggleLike }
}
