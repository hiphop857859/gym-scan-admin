import { Avatar as AntAvatar, AvatarProps } from 'antd'

const Avatar = ({ src = '/images/default-avatar.png', ...props }: AvatarProps) => {
  return <AntAvatar src={src} {...props} />
}

export default Avatar
