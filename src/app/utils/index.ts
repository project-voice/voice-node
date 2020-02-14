const createIdentity = (num: number): string => {
  const idenList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let identity = ''
  for (let i = 0; i < num; i++) {
    let random = Math.floor(Math.random() * idenList.length)
    identity += idenList[random]
  }

  return identity
}

export { createIdentity }
