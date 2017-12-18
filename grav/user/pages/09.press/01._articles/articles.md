---
title: 'Press Articles'

content:
    limit: 5
    pagination: true
    items: 
        - '@page.children': '/press'
    order:
        by: basename
        dir: desc

modules:
    items: '@self.modular'
    order:
        by: basename
        dir: asc
---

