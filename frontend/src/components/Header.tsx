const Header = () => {
  return <div className="my-4 text-center">
  <h1 className="font-light text-4xl">Reroll.ing</h1>
  {/* <br></br>
  <p>{`I bought this domain as a joke and I have to do something with it 🤡`}</p> */}
  <p>
    <a className="hover:text-blue-500 underline underline-offset-4" href="https://github.com/aaanh">@aaanh</a> | <a className="hover:text-blue-500 underline underline-offset-4" href="https://github.com/aaanh/reroll.ing">source repo</a> | <a className="hover:text-blue-500 underline underline-offset-4" href="https://aaanh.com">homepage</a>
  </p>
</div>
}

export default Header