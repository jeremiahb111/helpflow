import { useState, useRef } from "react"
import { fileReader } from "../utils/fileReader"
import { Loader, XIcon } from "lucide-react"
import useCreateTicket from "../hooks/useCreateTicket"

const CreateTicket = ({ showModal }) => {
  const fileInputRef = useRef(null)
  const [imgOrientation, setImgOrientation] = useState('')
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    priority: 'low',
    image: '',
  })

  const { createTicketMutation, isPending } = useCreateTicket()

  const handleChange = async (e) => {
    const { name, value, files } = e.target

    if (files) {
      const file = files[0]
      const base64 = await fileReader(file)

      const img = new Image()
      img.src = base64

      img.onload = () => {
        if (img.height > img.width) {
          setImgOrientation('portrait')
        } else {
          setImgOrientation('landscape')
        }
      }

      return setTicketData(prev => {
        return { ...prev, [name]: base64 }
      })
    }

    setTicketData(prev => {
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createTicketMutation(ticketData)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white max-h-[95%]  rounded-lg shadow-lg w-full max-w-lg  overflow-y-auto">
        <div>
          <div className="border-b border-gray-300 p-3 relative">
            <h2 className="text-2xl font-bold text-center">Create Ticket</h2>
            <button className="absolute  top-1/4 right-4 bg-gray-400 text-gray-200 hover:bg-gray-500 p-1 rounded-full">
              <XIcon onClick={() => showModal(false)} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-5 py-6 space-y-3">
              <span className="text-red-500">*</span>
              <label className="label">
                <span className="label-text text-neutral">Title:</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full border"
                required
                placeholder="Enter the title of the ticket"
                name="title"
                value={ticketData.title}
                onChange={handleChange}
              />

              <span className="text-red-500">*</span>
              <label className="label">
                <span className="label-text text-neutral">Description:</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full border"
                required
                placeholder="Enter the description of the ticket"
                name="description"
                value={ticketData.description}
                onChange={handleChange}
              ></textarea>

              <label className="label">
                <span className="label-text text-neutral">Priority:</span>
              </label>
              <select
                className="select select-bordered w-full"
                name="priority"
                value={ticketData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>


              <label className="label">
                <span className="label-text text-neutral">Image:</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full border"
                onChange={handleChange}
                accept="image/*"
                name="image"
                disabled={ticketData.image}
                ref={fileInputRef}
              />

              {
                ticketData.image && (
                  <div className="relative group inline-block">
                    <img
                      src={ticketData.image}
                      alt="Ticket related"
                      className={`${imgOrientation === 'portrait' ? 'h-64 w-auto' : 'w-full h-auto'} object-cover rounded`}
                    />

                    <XIcon
                      className="absolute top-1 right-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white p-1 rounded-full z-10"
                      onClick={() => {
                        setTicketData(prev => ({ ...prev, image: '' }));
                        fileInputRef.current.value = null;
                      }}
                      disabled={isPending}
                    />
                  </div>
                )
              }

              <div>
                <button className="px-4 mt-3 py-2 w-full bg-green-500 text-white rounded hover:bg-green-600" type="submit" disabled={isPending || !ticketData.title || !ticketData.description}>
                  {isPending ? (
                    <div className="flex gap-2 items-center justify-center">
                      <Loader className="animate-spin size-5 text-white" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default CreateTicket