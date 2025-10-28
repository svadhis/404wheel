export function copyData() {
    const participants = localStorage.getItem('participations') || '';
    navigator.clipboard.writeText(participants).then(() => {
      console.log('Copied to clipboard')
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }