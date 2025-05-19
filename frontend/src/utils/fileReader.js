export const fileReader = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => resolve(error)
  })
}