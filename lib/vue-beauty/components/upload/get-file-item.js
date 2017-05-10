export default function getFileItem (file, fileList) {
  const matchWay = (!file.uid) ? 'byName' : 'byUid'

  let target = fileList.filter(item => {
    if (matchWay === 'byName') {
      return item.name === file.name
    } else {
      return item.uid === file.uid
    }
  })[0]

  return target
}