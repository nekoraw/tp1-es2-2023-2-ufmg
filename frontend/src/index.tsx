/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import LoginPage from './components/authentication/Login'

const root = document.getElementById('root')

render(() => <LoginPage />, root!)
