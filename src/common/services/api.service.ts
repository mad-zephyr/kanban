import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export const SERVICES = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  CATEGORY: '/category',
  IMAGE: '/image',
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_PROD
    : process.env.NEXT_PUBLIC_API_DEV

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  // 'Access-Control-Allow-Origin': '*',
}

export const API = (): AxiosInstance => {
  const api = axios.create({
    baseURL: `${baseUrl}/api`,
    withCredentials: true,
    headers,
  })

  return api
}
