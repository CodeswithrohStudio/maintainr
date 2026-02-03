'use client'

import { useState, useEffect } from 'react'
import { apiClient, Project } from '@/lib/api'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const response = await apiClient.getProjects()
        
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setProjects(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchProject() {
      try {
        setLoading(true)
        const response = await apiClient.getProject(id)
        
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setProject(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, loading, error }
}
