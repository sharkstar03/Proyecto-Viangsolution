// src/components/dashboard/RecentActivity.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileSignature,
  DollarSign
} from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'FACTURA_CREADA':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'FACTURA_PAGADA':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'FACTURA_VENCIDA':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'COTIZACION_CREADA':
      return <FileSignature className="h-4 w-4 text-purple-500" />;
    case 'PAGO_RECIBIDO':
      return <DollarSign className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getActivityMessage = (activity) => {
  switch (activity.type) {
    case 'FACTURA_CREADA':
      return `Nueva factura creada (${activity.reference})`;
    case 'FACTURA_PAGADA':
      return `Factura pagada (${activity.reference})`;
    case 'FACTURA_VENCIDA':
      return `Factura vencida (${activity.reference})`;
    case 'COTIZACION_CREADA':
      return `Nueva cotización creada (${activity.reference})`;
    case 'PAGO_RECIBIDO':
      return `Pago recibido por $${activity.amount}`;
    default:
      return activity.message;
  }
};

const ActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-4 p-4">
    <div className="rounded-full p-2 bg-secondary">
      {getActivityIcon(activity.type)}
    </div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium">
        {getActivityMessage(activity)}
      </p>
      <div className="flex items-center text-xs text-muted-foreground">
        <span>{activity.date}</span>
        {activity.user && (
          <>
            <span className="mx-1">•</span>
            <span>{activity.user}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
          {activities.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No hay actividad reciente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;