import {inject} from '@loopback/core';
import {get, response} from '@loopback/rest';
import {juggler} from '@loopback/repository';

export class ReportesController {
  constructor(
    @inject('datasources.mysql')
    private dataSource: juggler.DataSource,
  ) {}

  @get('/reportes/total-por-dia')
  @response(200, {
    description: 'Total producido por día',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fecha: {type: 'string'},
              totalProducido: {type: 'number'},
            },
          },
        },
      },
    },
  })
  async totalPorDia(): Promise<{fecha: string; totalProducido: number}[]> {
    const sql = `
      SELECT DATE(fecha) AS fecha, SUM(cantidad) AS totalProducido
      FROM registrodecantidad
      WHERE tipo = 'produccion'
      GROUP BY DATE(fecha)
      ORDER BY fecha ASC
    `;
    const result = await this.dataSource.execute(sql);
    return result as {fecha: string; totalProducido: number}[];
  }

  @get('/reportes/por-operario')
  @response(200, {
    description: 'Producción por operario y proceso',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              operario: {type: 'string'},
              proceso: {type: 'string'},
              totalProducido: {type: 'number'},
            },
          },
        },
      },
    },
  })
  async porOperario(): Promise<
    {operario: string; proceso: string; totalProducido: number}[]
  > {
    const sql = `
      SELECT CONCAT(o.nombre, ' ', o.apellido) AS operario,
             p.nombre AS proceso,
             SUM(rc.cantidad) AS totalProducido
      FROM registrodecantidad rc
      JOIN operario o ON rc.operarioId = o.id
      JOIN procesoxtarjeta pxt ON rc.procesoXTarjetaId = pxt.id
      JOIN proceso p ON pxt.procesoId = p.id
      WHERE rc.tipo = 'produccion'
      GROUP BY o.id, p.id
      ORDER BY operario ASC
    `;
    const result = await this.dataSource.execute(sql);
    return result as {
      operario: string;
      proceso: string;
      totalProducido: number;
    }[];
  }

  @get('/reportes/tiempos')
  @response(200, {
    description: 'Comparación tiempos estándar vs real',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tarjetaCodigo: {type: 'string'},
              proceso: {type: 'string'},
              tiempoEstandar: {type: 'number'},
              tiempoReal: {type: 'number'},
              diferencia: {type: 'number'},
              porcentaje: {type: 'number'},
            },
          },
        },
      },
    },
  })
  async tiempos(): Promise<
    {
      tarjetaCodigo: string;
      proceso: string;
      tiempoEstandar: number;
      tiempoReal: number;
      diferencia: number;
      porcentaje: number;
    }[]
  > {
    const sql = `
      SELECT tp.codigo AS tarjetaCodigo,
             p.nombre AS proceso,
             pxt.tiempo AS tiempoEstandar,
             COALESCE(pxt.tiempoConsumido, 0) AS tiempoReal,
             (pxt.tiempo - COALESCE(pxt.tiempoConsumido, 0)) AS diferencia,
             ROUND(
               COALESCE(pxt.tiempoConsumido, 0) * 100.0 / NULLIF(pxt.tiempo, 0),
               1
             ) AS porcentaje
      FROM procesoxtarjeta pxt
      JOIN proceso p ON pxt.procesoId = p.id
      JOIN tarjetadeproduccion tp ON pxt.tarjetaDeProduccionId = tp.id
      WHERE pxt.tiempo IS NOT NULL
      ORDER BY tp.codigo ASC, p.nombre ASC
    `;
    const result = await this.dataSource.execute(sql);
    return result as {
      tarjetaCodigo: string;
      proceso: string;
      tiempoEstandar: number;
      tiempoReal: number;
      diferencia: number;
      porcentaje: number;
    }[];
  }

  @get('/reportes/paradas')
  @response(200, {
    description: 'Paradas agrupadas por código',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              codigo: {type: 'string'},
              descripcion: {type: 'string'},
              veces: {type: 'number'},
              cantidadPerdida: {type: 'number'},
            },
          },
        },
      },
    },
  })
  async paradas(): Promise<
    {codigo: string; descripcion: string; veces: number; cantidadPerdida: number}[]
  > {
    const sql = `
      SELECT cp.codigo,
             cp.descripcion,
             COUNT(*) AS veces,
             SUM(p.cantidadReportada) AS cantidadPerdida
      FROM parada p
      JOIN codigodeparada cp ON p.codigoDeParadaId = cp.id
      GROUP BY cp.id
      ORDER BY veces DESC
    `;
    const result = await this.dataSource.execute(sql);
    return result as {
      codigo: string;
      descripcion: string;
      veces: number;
      cantidadPerdida: number;
    }[];
  }
}
