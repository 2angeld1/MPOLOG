import { Router } from 'express';
import { generarReportePDF, generarReporteExcel, generarReportePNG } from '../controllers/reportController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/pdf', auth, generarReportePDF);
router.get('/excel', auth, generarReporteExcel);
router.get('/png', auth, generarReportePNG);

export default router;