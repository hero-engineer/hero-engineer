import fs from 'node:fs'

import { parse } from '@babel/parser'

import { FileNodePayloadType, FileNodeType } from '../../types'

type CreateFileNodeDataType = Omit<FileNodeType, 'payload'> & { payload: Omit<FileNodePayloadType, 'code' | 'ast'> }

function createFileNode(data: CreateFileNodeDataType): FileNodeType {
  return {
    ...data,
    payload: {
      ...data.payload,
      get code() {
        return fs.readFileSync(data.payload.path, 'utf8')
      },
      get ast() {
        return parse(
          this.code,
          {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          }
        )
      },
    },
  }
}

export default createFileNode
