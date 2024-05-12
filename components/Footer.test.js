import React from 'react'
import { render } from '@testing-library/react'
import Footer from './Footer'

test('render footer', () => {
  const component = render(<Footer/>)
  component.getByText('Technical test - Juan Sánchez Rodríguez')
})