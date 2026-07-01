# วิธี Deploy เว็บ SIS ขึ้น Render.com

เว็บนี้เป็น static site ไม่มี dependency และไม่มี build step จึง deploy บน Render ได้ตรงจาก GitHub

## วิธีที่ 1: Deploy ผ่าน Render Dashboard

1. Push โปรเจกต์ขึ้น GitHub repo `kofkung/SIS_Mainways`
2. เข้า [Render Dashboard](https://dashboard.render.com/)
3. กด **New > Static Site**
4. Connect repository: `kofkung/SIS_Mainways`
5. ตั้งค่า:
   - Branch: `main`
   - Build Command: `echo "No build step required"`
   - Publish Directory: `.`
6. กด **Create Static Site**
7. หลัง deploy สำเร็จ Render จะให้ URL รูปแบบ `https://<service-name>.onrender.com`

## วิธีที่ 2: Deploy ด้วย Blueprint

ใน repo มีไฟล์ `render.yaml` แล้ว สามารถเลือก **New > Blueprint** บน Render แล้วเชื่อม repo นี้ได้เลย

ค่าหลักใน Blueprint:

```yaml
services:
  - type: web
    runtime: static
    buildCommand: echo "No build step required"
    staticPublishPath: .
```

## หมายเหตุสำหรับ Production

- ตอนนี้หน้า Contact เป็น front-end state สำหรับโชว์ UX เท่านั้น ยังไม่ได้ส่งอีเมลจริง
- ถ้าต้องการรับข้อความจริง ให้เชื่อม form กับ backend, email service, หรือ Render Web Service
- หลังจากเชื่อม domain จริง ให้ตั้งค่า Custom Domain ในหน้า Settings ของ Static Site บน Render
