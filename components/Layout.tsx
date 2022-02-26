import Header from './Header'
import Footer from './Footer'

const Layout: React.FC = ({ children }) => {
  return (
    <div className='overflow-x-hidden flex-col min-h-screen' data-testid='layout'>
      <Header />
      <main className='grow'>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
