import {
	Container,
	Box
} from '@mui/material'

const PageContainer = ({children}) => {
	return (
		<div style={{
			flex: 1,
			padding: '2em 0',
		}}>
			<Container maxWidth='xl'>
				{children}
			</Container>
		</div>
	)
}

export default PageContainer
