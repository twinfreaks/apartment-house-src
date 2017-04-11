export interface UserData {
  username: string,
  password: string,
  roles?: any,
  passwordPrevious?: string,
  passwordRepeat?: string,
  remember?: boolean
}