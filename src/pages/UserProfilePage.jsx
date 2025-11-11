import { useParams } from 'react-router-dom'

function UserProfilePage() {
  const { id } = useParams()
  return <h1>User Profile: {id}</h1>
}

export default UserProfilePage


