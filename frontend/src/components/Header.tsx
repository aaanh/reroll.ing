import { Fragment, useState, type MouseEvent } from "react"
import About from "./About"
import Link from "next/link"

interface ICustomLinkProps {
  url: string
  label: string
  children?: React.ReactNode
}

const CustomLink = ({ url, label, children }: ICustomLinkProps) => {
  return <a href={url} className="hover:text-blue-500 underline underline-offset-4">{label}{children}</a>
}

const Header = () => {
  const [showAbout, setShowAbout] = useState(false)

  function handleShowAbout(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setShowAbout(prev => !prev);
  }

  const navLinks: ICustomLinkProps[] = [
    {
      url: "https://github.com/aaanh",
      label: "@aaanh"
    },
    {
      url: "https://github.com/aaanh/reroll.ing",
      label: "source"
    },
    {
      url: "https://aaanh.com",
      label: "homepage"
    },
    {
      url: "/servants",
      label: "servants index"
    },
    {
      url: "/stats",
      label: "session stats summary"
    }
  ]

  return <div className="mb-4 text-center">
    <h1 className="font-light text-4xl rounded-xl border-2 py-1 hover:border-green-500 hover:text-green-500 transition-all ease-in-out"><Link href="/">Reroll.ing</Link></h1>
    <p>
      {navLinks.map((link: ICustomLinkProps, idx: number) => <Fragment key={idx}>
        <CustomLink url={link.url} label={link.label}>{link.children ?? null}</CustomLink>&nbsp;|&nbsp;
      </Fragment>
      )}
      <button className="hover:text-blue-500 underline underline-offset-4" onClick={handleShowAbout}>about</button>
    </p>
    <About setShow={handleShowAbout} show={showAbout}></About>
  </div>
}

export default Header