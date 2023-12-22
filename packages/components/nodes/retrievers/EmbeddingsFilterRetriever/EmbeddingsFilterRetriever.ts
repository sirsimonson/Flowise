import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { BaseRetriever } from 'langchain/schema/retriever'
import { Embeddings } from 'langchain/embeddings/base'
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression'
import { EmbeddingsFilter } from 'langchain/retrievers/document_compressors/embeddings_filter'

class EmbeddingsFilterRetriever_Retrievers implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]
    badge: string

    constructor() {
        this.label = 'Embeddings Filter Retriever'
        this.name = 'embeddingsFilterRetriever'
        this.version = 1.0
        this.type = 'EmbeddingsFilterRetriever'
        this.icon = 'compressionRetriever.svg'
        this.category = 'Retrievers'
        this.badge = 'NEW'
        this.description = 'A document compressor that uses embeddings to drop documents unrelated to the query'
        this.baseClasses = [this.type, 'BaseRetriever']
        this.inputs = [
            {
                label: 'Base Retriever',
                name: 'baseRetriever',
                type: 'VectorStoreRetriever'
            },
            {
                label: 'Embeddings',
                name: 'embeddings',
                type: 'Embeddings',
                optional: false
            },
            {
                label: 'Similarity Threshold',
                name: 'similarityThreshold',
                description:
                    'Threshold for determining when two documents are similar enough to be considered redundant. Must be specified if `k` is not set',
                type: 'number',
                default: 0.8,
                step: 0.1,
                optional: true
            },
            {
                label: 'K',
                name: 'k',
                description:
                    'The number of relevant documents to return. Can be explicitly set to undefined, in which case similarity_threshold must be specified. Defaults to 20',
                type: 'number',
                default: 20,
                step: 1,
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const baseRetriever = nodeData.inputs?.baseRetriever as BaseRetriever
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const similarityThreshold = nodeData.inputs?.similarityThreshold as string
        const k = nodeData.inputs?.k as string

        if (k === undefined && similarityThreshold === undefined) {
            throw new Error(`Must specify one of "k" or "similarity_threshold".`)
        }

        let similarityThresholdNumber = 0.8
        if (similarityThreshold) {
            similarityThresholdNumber = parseFloat(similarityThreshold)
        }
        let kNumber = 0.8
        if (k) {
            kNumber = parseFloat(k)
        }
        const baseCompressor = new EmbeddingsFilter({
            embeddings: embeddings,
            similarityThreshold: similarityThresholdNumber,
            k: kNumber
        })

        return new ContextualCompressionRetriever({
            baseCompressor,
            baseRetriever: baseRetriever
        })
    }
}

module.exports = { nodeClass: EmbeddingsFilterRetriever_Retrievers }