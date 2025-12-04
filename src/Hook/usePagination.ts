import { useCallback, useState, useRef } from 'react'

const usePaging = ({ singlePage = false, orderByField = 'code' }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageNumber: 1,
    pageSize: singlePage ? 0 : 10,
    total: 10,
    orderBy: singlePage ? `${orderByField} asc` : undefined,
    showSizeChanger: true,
    position: ['bottomRight']
  })

  const paginationRef = useRef(pagination)

  const handleOnChange = (_pagination: {
    current: number
    pageNumber: number
    pageSize: number
    total: number
    orderBy: string | undefined
    sorts: string | undefined

    showSizeChanger?: boolean | undefined
  }) => {
    const pageNumber = paginationRef.current.pageSize === _pagination.pageSize ? _pagination.current : 1

    const newPagination = {
      ...paginationRef.current,
      ..._pagination,
      pageNumber,
      current: pageNumber
    }

    paginationRef.current = newPagination
    setPagination(newPagination)
  }

  const resetCurrent = useCallback(() => {
    const newPagination = {
      ...paginationRef.current,
      current: 1,
      pageNumber: 1
    }

    paginationRef.current = newPagination
    setPagination(newPagination)
  }, [])

  const setTotal = useCallback((total: number) => {
    const newPagination = {
      ...paginationRef.current,
      total
    }

    paginationRef.current = newPagination
    setPagination(newPagination)
  }, [])

  const getOrdinalNumber = useCallback(
    (index: number) => (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    []
  )

  const paginationQueryParams = useCallback(() => {
    return { ...paginationRef.current }
  }, [])

  const updateCurrentPage = useCallback((newPage: number) => {
    if (newPage < 1) return
    const newPagination = {
      ...paginationRef.current,
      current: newPage,
      pageNumber: newPage
    }

    paginationRef.current = newPagination
    setPagination(newPagination)
  }, [])

  const checkNeedRecall = useCallback(
    (total: number) => {
      if (total === 0) {
        updateCurrentPage(1)
        return false
      }
      if (paginationRef.current.pageNumber === 1) return false

      const lastPage = Math.ceil(total / paginationRef.current.pageSize)
      if (lastPage === 0) {
        updateCurrentPage(1)
        return false
      }

      const needRecall = paginationRef.current.pageNumber > lastPage
      if (needRecall) {
        updateCurrentPage(lastPage)
      }

      return needRecall
    },
    [updateCurrentPage]
  )

  return {
    pagination,
    paginationQueryParams,
    handleOnChange,
    resetCurrent,
    getOrdinalNumber,
    setTotal,
    checkNeedRecall,
    updateCurrentPage
  }
}

export default usePaging
