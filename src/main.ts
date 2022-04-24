import { selectEl } from '@utils'
import App from 'App'

const node = selectEl(document, '#App')
new App({ node, initalState: null })
