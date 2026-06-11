// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_TRUST_METRICS_API_URL = 'http://localhost:8005'

// Global test utilities
global.fetch = jest.fn()

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
  global.fetch.mockClear()
})
