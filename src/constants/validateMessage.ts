const typeTemplate = 'Vui lòng nhập đúng định dạng ${type}'
export const validateMessages = {
  default: "Validation error on field '${label}'",
  required: 'Vui lòng nhập vào trường bắt buộc',
  enum: "'${label}' nên chứa một trong [${enum}]",
  whitespace: "'${label}' không được để trống",
  date: {
    format: "'${label}' sai kiểu dữ liệu ngày tháng",
    parse: "'${label}' không thể phân tích cú pháp như ngày tháng",
    invalid: "'${label}' không hợp lệ"
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate
  },
  string: {
    len: 'Vui lòng nhập chính xác ${len} ký tự',
    min: 'Vui lòng nhập ít nhất ${min} ký tự',
    max: 'Vui lòng nhập ít hơn ${max} ký tự',
    range: 'Vui lòng nhập từ ${min} đến ${max} kí tự'
  },
  number: {
    len: 'Vui lòng nhập bằng ${len}',
    min: 'Vui lòng nhập không thể nhỏ hơn ${min}',
    max: 'Vui lòng nhập không thể lớn hơn ${max}',
    range: 'Vui lòng nhập từ ${min} đến ${max}'
  },
  array: {
    len: "'${label}' nên chính xác ${len} chiều dài mảng",
    min: "'${label}' không thể ít hơn ${min} chiều dài mảng",
    max: "'${label}' không thể nhiều hơn ${max} chiều dài mảng",
    range: "'${label}' nên từ ${min} đến ${max} chiều dài mảng"
  },
  pattern: {
    mismatch: "'${label}' không phù hợp với mẫu ${pattern}"
  }
}
