import Container from './Container'

interface Props {
  name?: string
  close: () => void
  className?: string
}

const Modal: React.FC<Props> = ({ children, name, close, className }) => {
  return (
    <div className={`z-30 fixed inset-0 bg-black pt-4 pb-12 overscroll-contain ${className}`}>
      <Container>
        <div className='flex justify-between items-center'>
          <div>
            <h2>{name}</h2>
          </div>
          <div>
            <button onClick={close} className='button text-sm'>Close</button>
          </div>
        </div>
        <div>
          {children}
        </div>
      </Container>
    </div>
  )
};

export default Modal
