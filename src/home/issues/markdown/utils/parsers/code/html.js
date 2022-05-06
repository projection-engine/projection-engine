import React from 'react'

export default function htmlParser(htmlText) {

  return htmlText
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')

      // attr
      .replaceAll(/[a-zA-Z0-9]+=/ig, '<b style="color: #0095ff;">$&</b>')

      // attr value
      .replaceAll(/{[^}]*}/ig, '<span style="color: #007d07;" >$&</span>')

      // tag
      .replaceAll(/&lt;[a-zA-Z0-9]+\s/ig, '<b style="color:#86128f;">$&</b>')
      .replaceAll(/&lt;[a-zA-Z0-9]+&gt;/g, '<b style="color:#86128f;">$&</b>')
      .replaceAll(/&lt;\/[a-zA-Z0-9]+&gt;/g, '<b style="color:#86128f;">$&</b>')
      // attr value
      .replaceAll(/\s[a-zA-Z0-9]+""[a-zA-Z0-9]+"/ig, '<span style="color: #007d07;">$&</span>')

      // attr
      .replaceAll(/"[a-zA-Z0-9]+"/ig, '<span style="color: #007d07;">$&</span>')
}
