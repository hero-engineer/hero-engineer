import { gql } from 'apollo-server-express'
// @ts-expect-error
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'

import withLog from './withLog.js'

import fileQuery from './queries/fileQuery.js'
import filesQuery from './queries/filesQuery.js'
import filePathsQuery from './queries/filePathsQuery.js'
import packagesUpdatesQuery from './queries/packagesUpdatesQuery.js'
import undoRedoMetadataQuery from './queries/undoRedoMetdataQuery.js'

import saveFileMutation from './mutations/saveFileMutation.js'
import uploadFileMutation from './mutations/uploadFileMutation.js'
import installOrUpdatePackageMutation from './mutations/installOrUpdatePackageMutation.js'
import undoMutation from './mutations/undoMutation.js'
import redoMutation from './mutations/redoMutation.js'
import pushMutation from './mutations/pushMutation.js'

export const typeDefs = gql`
  scalar Upload

  type Package {
    name: String!
    version: String!
    type: String!
  }

  type UndoRedoMetadataOutput {
    undoMessage: String!
    redoMessage: String
  }

  type FileType {
    path: String!
    code: String!
  }

  type Query {
    file(filePath: String!): String!
    files: [FileType]!
    filePaths: [String!]!

    packagesUpdates: [Package]!

    undoRedoMetadata: UndoRedoMetadataOutput!
  }

  type Mutation {
    saveFile(filePath: String!, code: String!, commitMessage: String!): Boolean!
    uploadFile(file: Upload!, fileName: String!): String!

    installOrUpdatePackage(name: String!, version: String!, type: String!, shouldDelete: Boolean!): Boolean!

    undo: Boolean!
    redo: Boolean!
    push: Boolean!
  }
`

export const resolvers = {
  Query: {
    file: withLog(fileQuery, 'file'),
    files: withLog(filesQuery, 'files'),
    filePaths: withLog(filePathsQuery, 'filePaths'),

    packagesUpdates: withLog(packagesUpdatesQuery, 'packagesUpdates'),

    undoRedoMetadata: withLog(undoRedoMetadataQuery, 'undoRedoMetadata'),
  },
  Mutation: {
    saveFile: withLog(saveFileMutation, 'saveFile', true),
    uploadFile: withLog(uploadFileMutation, 'uploadFile', true),

    installOrUpdatePackage: withLog(installOrUpdatePackageMutation, 'installOrUpdatePackage', true),

    undo: withLog(undoMutation, 'undo', true),
    redo: withLog(redoMutation, 'redo', true),
    push: withLog(pushMutation, 'push', true),
  },
  Upload: GraphQLUpload,
}
