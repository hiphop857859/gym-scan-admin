import { Modal, Spin, Tag } from 'antd'
import dayjs from 'dayjs'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'

interface Props {
  modalDetailId: string | boolean
  handleCancel: () => void
  handleOk: () => void
}

const ModalDetail = ({ modalDetailId, handleCancel, handleOk }: Props) => {
  const { data, loading } = useQuery({
    func: Service.getMachineDetail,
    params: modalDetailId,
    isQuery: !!modalDetailId
  })

  const machine = data as any

  return (
    <Modal
      open={!!modalDetailId}
      onCancel={handleCancel}
      onOk={handleOk}
      width={900}
      title="Machine Detail"
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* IMAGE */}
          <div>
            <p className="font-semibold mb-2">Image</p>
            {machine?.imageNewUrl ? (
              <img
                src={machine.imageNewUrl}
                alt="machine"
                className="w-full h-64 object-cover rounded-xl border"
              />
            ) : (
              <Tag>No image</Tag>
            )}
          </div>

          {/* VIDEO */}
          <div>
            <p className="font-semibold mb-2">Video</p>
            {machine?.videoNewUrl ? (
              <video
                src={machine.videoNewUrl}
                controls
                className="w-full h-64 rounded-xl border"
              />
            ) : (
              <Tag>No video</Tag>
            )}
          </div>

          {/* INFO */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Machine Name</p>
              <p>{machine?.deviceName || '--'}</p>
            </div>

            <div>
              <p className="font-semibold">Machine Key</p>
              <p>{machine?.machineKey || '--'}</p>
            </div>

            <div>
              <p className="font-semibold">Type</p>
              {machine?.isGymMachine ? (
                <Tag color="blue">Gym Machine</Tag>
              ) : (
                <Tag color="green">Free Weight</Tag>
              )}
            </div>

            <div>
              <p className="font-semibold">Created At</p>
              <p>
                {machine?.createdAt
                  ? dayjs(machine.createdAt).format('DD/MM/YYYY HH:mm')
                  : '--'}
              </p>
            </div>

            {/* INSTRUCTION */}
            <div className="col-span-2">
              <p className="font-semibold">Instruction</p>
              {machine?.instruction ? (
                <p className="whitespace-pre-line">{machine.instruction}</p>
              ) : (
                <Tag>No instruction</Tag>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ModalDetail
