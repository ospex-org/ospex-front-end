export const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (fileContent: string) => void
): void => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        console.log("File content before callback:", e.target.result.toString())
        callback(e.target.result.toString())
      }
    }
    reader.readAsText(file)
  }
}
