// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ChartCard, { AreaChartCard } from '../components/dashboard/ChartCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventas: { total: 0, cambio: 0 },
    facturas: { total: 0, cambio: 0 },
    cotizaciones: { total: 0, cambio: 0 },
    clientes: { total: 0, cambio: 0 }
  });

  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Aquí se cargarían los datos reales desde el backend
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Datos de ejemplo - estos vendrían de tu API
    setStats({
      ventas: { total: '$125,000', cambio: 12.5 },
      facturas: { total: '45', cambio: -2.3 },
      cotizaciones: { total: '28', cambio: 8.4 },
      clientes: { total: '184', cambio: 4.1 }
    });

    setChartData([
      { name: 'Ene', ventas: 4000 },
      { name: 'Feb', ventas: 3000 },
      { name: 'Mar', ventas: 2000 },
      { name: 'Abr', ventas: 2780 },
      { name: 'May', ventas: 1890 },
      { name: 'Jun', ventas: 2390 },
      { name: 'Jul', ventas: 3490 }
    ]);

    setActivities([
      {
        type: 'FACTURA_CREADA',
        reference: 'F-2024-001',
        date: '2024-01-19 14:30',
        user: 'Juan Pérez'
      },
      {
        type: 'PAGO_RECIBIDO',
        reference: 'P-2024-001',
        amount: '1,500.00',
        date: '2024-01-19 13:15',
        user: 'María García'
      },
      {
        type: 'COTIZACION_CREADA',
        reference: 'C-2024-015',
        date: '2024-01-19 11:45',
        user: 'Carlos Rodríguez'
      },
      {
        type: 'FACTURA_PAGADA',
        reference: 'F-2024-002',
        date: '2024-01-19 10:30',
        user: 'Ana López'
      }
    ]);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ventas Totales"
          value={stats.ventas.total}
          change={stats.ventas.cambio}
          changeType={stats.ventas.cambio >= 0 ? 'increase' : 'decrease'}
          icon={DollarSign}
        />
        <StatsCard
          title="Facturas Emitidas"
          value={stats.facturas.total}
          change={stats.facturas.cambio}
          changeType={stats.facturas.cambio >= 0 ? 'increase' : 'decrease'}
          icon={FileText}
        />
        <StatsCard
          title="Cotizaciones"
          value={stats.cotizaciones.total}
          change={stats.cotizaciones.cambio}
          changeType={stats.cotizaciones.cambio >= 0 ? 'increase' : 'decrease'}
          icon={TrendingUp}
        />
        <StatsCard
          title="Clientes Activos"
          value={stats.clientes.total}
          change={stats.clientes.cambio}
          changeType={stats.clientes.cambio >= 0 ? 'increase' : 'decrease'}
          icon={Users}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Ventas Mensuales"
          data={chartData}
          dataKey="ventas"
          stroke="#8884d8"
        />
        <AreaChartCard
          title="Tendencia de Ingresos"
          data={chartData}
          dataKey="ventas"
          stroke="#2563eb"
          fill="#2563eb"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity activities={activities} />
        
        {/* Additional Card for Future Use */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Here you can add upcoming due dates or pending tasks */}
              <div className="text-sm text-muted-foreground">
                No hay vencimientos próximos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;