export const decodeJwtAndStore = (token: string) => {
    try {
    const payload = token.split('.')[1];
    const decode = JSON.parse(atob(payload));
    localStorage.setItem('id', decode.id)
    localStorage.setItem('username', decode.username)
  } catch (e) {
    console.error('Invalid JWT', e);
    return null;
  }
}