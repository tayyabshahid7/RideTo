import axios from 'axios'
import * as _ from 'lodash'

export const submitForm = async (portalId, formId, data) => {
  try {
    const fields = _.map(data, (value, name) => {
      return { name, value }
    })

    var postData = JSON.stringify({ fields })

    var options = {
      url: `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: postData
    }
    const response = await axios(options)
    return response
  } catch (err) {
    return err.response
  }
}
