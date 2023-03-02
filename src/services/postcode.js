import postcodes from 'node-postcodes.io'

export const retrievePostCode = async (lat, lng) => {
  let postcode = 'London'
  try {
    const postcodeIo = await postcodes.geo([
      {
        longitude: lng,
        latitude: lat,
        radius: 2000,
        limit: 5
      }
    ])
    if (postcodeIo.result && postcodeIo.result.length > 0) {
      if (postcodeIo.result[0].result) {
        postcode = postcodeIo.result[0].result[0].postcode
      } else {
        const outcodeIo = await postcodes.outcodes(lat, lng, {
          limit: 5,
          radius: 2000
          // wideSearch: true
        })
        if (outcodeIo.result && outcodeIo.result.length > 0) {
          postcode = outcodeIo.result[0].outcode
        }
      }
    }
  } catch (err) {
    console.error(err)
    return postcode
  }

  return postcode
}
