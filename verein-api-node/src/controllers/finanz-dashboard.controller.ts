/**
 * Finanz Dashboard Controller
 * Financial statistics and dashboard data
 */

import { Request, Response } from 'express';
import { getPool, mssql } from '../config/database';
import { ApiResponse, FinanzDashboardStats } from '../models';

// GET /api/finanzdashboard/stats - Get dashboard statistics
export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;
    
    const pool = await getPool();
    const request = pool.request();
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    request.input('currentYear', mssql.Int, currentYear);
    request.input('currentMonth', mssql.Int, currentMonth);
    request.input('previousMonth', mssql.Int, previousMonth);
    request.input('previousMonthYear', mssql.Int, previousMonthYear);
    request.input('today', mssql.Date, now);

    let vereinFilter = '';
    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      vereinFilter = 'AND VereinId = @vereinId';
    }

    // Current month payments
    const einnahmenAktuellerMonat = await request.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedZahlung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND YEAR(Zahlungsdatum) = @currentYear
        AND MONTH(Zahlungsdatum) = @currentMonth
        ${vereinFilter}
    `);

    // Current month claims
    const request2 = pool.request();
    request2.input('currentYear', mssql.Int, currentYear);
    request2.input('currentMonth', mssql.Int, currentMonth);
    if (vereinId) request2.input('vereinId', mssql.Int, vereinId);
    
    const forderungenAktuellerMonat = await request2.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedForderung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND YEAR(Faelligkeit) = @currentYear
        AND MONTH(Faelligkeit) = @currentMonth
        ${vereinFilter}
    `);

    // Previous month payments
    const request3 = pool.request();
    request3.input('previousMonthYear', mssql.Int, previousMonthYear);
    request3.input('previousMonth', mssql.Int, previousMonth);
    if (vereinId) request3.input('vereinId', mssql.Int, vereinId);
    
    const einnahmenVormonat = await request3.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedZahlung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND YEAR(Zahlungsdatum) = @previousMonthYear
        AND MONTH(Zahlungsdatum) = @previousMonth
        ${vereinFilter}
    `);

    // Previous month claims
    const request4 = pool.request();
    request4.input('previousMonthYear', mssql.Int, previousMonthYear);
    request4.input('previousMonth', mssql.Int, previousMonth);
    if (vereinId) request4.input('vereinId', mssql.Int, vereinId);
    
    const forderungenVormonat = await request4.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedForderung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND YEAR(Faelligkeit) = @previousMonthYear
        AND MONTH(Faelligkeit) = @previousMonth
        ${vereinFilter}
    `);

    // Year totals
    const request5 = pool.request();
    request5.input('currentYear', mssql.Int, currentYear);
    if (vereinId) request5.input('vereinId', mssql.Int, vereinId);
    
    const einnahmenJahr = await request5.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedZahlung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND YEAR(Zahlungsdatum) = @currentYear
        ${vereinFilter}
    `);

    const request6 = pool.request();
    request6.input('currentYear', mssql.Int, currentYear);
    if (vereinId) request6.input('vereinId', mssql.Int, vereinId);
    
    const forderungenJahr = await request6.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedForderung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND YEAR(Faelligkeit) = @currentYear
        ${vereinFilter}
    `);

    // Open and overdue amounts
    const request7 = pool.request();
    request7.input('today', mssql.Date, now);
    if (vereinId) request7.input('vereinId', mssql.Int, vereinId);
    
    const openAmounts = await request7.query(`
      SELECT 
        ISNULL(SUM(CASE WHEN BezahltAm IS NULL THEN Betrag ELSE 0 END), 0) as OffeneGesamt,
        ISNULL(SUM(CASE WHEN BezahltAm IS NULL AND Faelligkeit < @today THEN Betrag ELSE 0 END), 0) as UeberfaelligeGesamt,
        COUNT(DISTINCT CASE WHEN BezahltAm IS NULL THEN MitgliedId END) as MitgliederMitOffenen,
        COUNT(CASE WHEN BezahltAm IS NULL AND Faelligkeit < @today THEN 1 END) as AnzahlUeberfaellige
      FROM [Finanz].[MitgliedForderung]
      WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)
        ${vereinFilter}
    `);

    const stats: FinanzDashboardStats = {
      einnahmenAktuellerMonat: einnahmenAktuellerMonat.recordset[0]?.Total || 0,
      forderungenAktuellerMonat: forderungenAktuellerMonat.recordset[0]?.Total || 0,
      einnahmenVormonat: einnahmenVormonat.recordset[0]?.Total || 0,
      forderungenVormonat: forderungenVormonat.recordset[0]?.Total || 0,
      einnahmenJahr: einnahmenJahr.recordset[0]?.Total || 0,
      forderungenJahr: forderungenJahr.recordset[0]?.Total || 0,
      offeneForderungenGesamt: openAmounts.recordset[0]?.OffeneGesamt || 0,
      ueberfaelligeForderungenGesamt: openAmounts.recordset[0]?.UeberfaelligeGesamt || 0,
      anzahlMitgliederMitOffenenForderungen: openAmounts.recordset[0]?.MitgliederMitOffenen || 0,
      anzahlUeberfaelligeForderungen: openAmounts.recordset[0]?.AnzahlUeberfaellige || 0,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Dashboard-Statistiken' } as ApiResponse<null>);
  }
}

