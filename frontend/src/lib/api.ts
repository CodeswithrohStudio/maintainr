const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface Project {
  _id: string
  ownerId: string
  githubRepoUrl: string
  ensName?: string
  recipients: string[]
  splits: number[]
  projectIdOnchain: number
  createdAt: string
  __v: number
}

export interface Donation {
  id: string
  projectId: string
  donorAddress: string
  donorENS?: string
  amount: string
  message?: string
  txHash: string
  timestamp: string
  source: 'onchain' | 'yellow'
}

export interface User {
  _id: string
  githubId: string
  handle: string
  walletAddress?: string
  ensName?: string
  createdAt: string
  __v: number
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Projects
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/projects')
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`)
  }

  async createProject(data: {
    githubRepoUrl: string
    recipients: string[]
    splits: number[]
  }): Promise<ApiResponse<Project>> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Users
  async getUserByHandle(handle: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${handle}`)
  }

  async updateUserWallet(handle: string, walletAddress: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${handle}/wallet`, {
      method: 'PATCH',
      body: JSON.stringify({ walletAddress }),
    })
  }

  // Donations
  async getProjectDonations(projectId: string): Promise<ApiResponse<Donation[]>> {
    return this.request<Donation[]>(`/projects/${projectId}/donations`)
  }

  // ENS
  async resolveENSName(address: string): Promise<ApiResponse<{ name: string }>> {
    return this.request<{ name: string }>(`/ens/resolve/${address}`)
  }

  async resolveENSAddress(name: string): Promise<ApiResponse<{ address: string }>> {
    return this.request<{ address: string }>(`/ens/address/${name}`)
  }

  async getENSAvatar(name: string): Promise<ApiResponse<{ avatar: string }>> {
    return this.request<{ avatar: string }>(`/ens/avatar/${name}`)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health')
  }
}

export const apiClient = new ApiClient()
