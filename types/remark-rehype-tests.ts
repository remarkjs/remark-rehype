import unified = require('unified')
import remark2rehype = require('remark-rehype')

unified().use(remark2rehype)

unified().use(remark2rehype, {allowDangerousHtml: true})

unified().use(remark2rehype, unified())

unified().use(remark2rehype, unified(), {allowDangerousHtml: true})
