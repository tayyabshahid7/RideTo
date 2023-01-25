import postcodes from 'node-postcodes.io'

export const retrievePostCode = async (lat, lng) => {
  let postcode = 'London'
  try {
    const postcodeIo = await postcodes.geo(lat, lng, {
      limit: 1,
      radius: 1,
      wideSearch: false
    })
    if (postcodeIo.result && postcodeIo.result.length > 0) {
      postcode = postcodeIo.result[0].postcode
    }
  } catch (err) {
    console.error(err)
  }

  return postcode
}
