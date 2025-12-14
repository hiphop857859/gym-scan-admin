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
  // ✅ GET DETAIL
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
          {/* ✅ IMAGE */}
          <div>
            <p className="font-semibold mb-2">Image</p>
            <img
              src={machine?.imageNewUrl}
              alt="machine"
              className="w-full h-64 object-cover rounded-xl border"
            />
          </div>

          {/* ✅ VIDEO */}
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

          {/* ✅ INFO */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Machine Name</p>
              <p>{machine?.deviceName}</p>
            </div>

            <div>
              <p className="font-semibold">Machine Key</p>
              <p>{machine?.machineKey}</p>
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

            {/* ✅ MUSCLES */}
            <div>
              <p className="font-semibold">Primary Muscles</p>
              {machine?.primaryMuscles?.map((m: string) => (
                <Tag key={m}>{m}</Tag>
              ))}
            </div>

            <div>
              <p className="font-semibold">Secondary Muscles</p>
              {machine?.secondaryMuscles?.map((m: string) => (
                <Tag key={m}>{m}</Tag>
              ))}
            </div>

            {/* ✅ INSTRUCTION */}
            <div className="col-span-2">
              <p className="font-semibold">Instruction</p>
              <p className="whitespace-pre-line">{machine?.instruction}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ModalDetail
