import { useEffect, useState } from 'react'
import Url from '../server/schema/URLSchema'

const Redirect = ({ message }) => {
  const [timer, setTimer] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer - 1)
    }, 1000)

    setTimeout(() => {
      window.location.href = '/'
    }, 3500)

    return () => clearInterval(interval)
  }, [message])

  return (
    <div>
      Redirecting to home page in {timer}s - {message}
    </div>
  )
}

export default Redirect

// get the urlCode from the query string
// const { urlCode } = req.query
// // check if the urlCode is in the database
// const url = await Url.findOne({ urlCode: urlCode })
// if (url) {
//   // if so, redirect to the original url
//   res.redirect(url.originalUrl)
// } else {
//   // if not, return an error
//   res.status(404).json({ message: 'No URL found' })
// }

export async function getServerSideProps(context) {
  const { id } = context.query
  let urlCode = id

  const url = await Url.findOne({ urlCode: urlCode })

  if (url) {
    return {
      redirect: {
        destination: url.originalUrl,
        permanent: false,
      },
    }
  } else {
    return {
      props: {
        message: 'No URL found',
      },
    }
  }
}
