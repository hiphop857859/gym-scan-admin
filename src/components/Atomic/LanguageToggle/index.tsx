// import { Select } from 'antd'
// import { LOCAL_STORAGE_KEY } from 'src/enums'
// import { LocalStorage } from 'src/utils/localStorage.util'

// type Props = {
//   onChange?: VoidFunction
// }

// const LanguageToggle = ({ onChange }: Props) => {

//   const handleOnChange = (value: any) => {
//     LocalStorage.set(value, LOCAL_STORAGE_KEY.LANGUAGE)
//     onChange && onChange()
//   }

//   return (
//     <Select value={value} style={{ width: 120, height: 40, marginBottom: 4 }} onChange={handleOnChange}>
//       {/* {languages.map((item) => (
//         <Option key={item.value} value={item.value}>
//           <div className='flex justify-center items-center gap-1'>
//             <span role='img' className='pt-1 inline-block ' aria-label={item.label}>
//               {item.img}
//             </span>
//             <span className='capitalize'>{item.label}</span>
//           </div>
//         </Option>
//       ))} */}
//     </Select>
//   )
// }

// export default LanguageToggle
