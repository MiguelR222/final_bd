"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Descubre lo que pasa a tu alrededor con LiveIt 🎭
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-lg">
          <p>
            En la ciudad, cada día está lleno de conciertos, exposiciones, talleres, ferias y más. Pero a veces, es difícil enterarse de todo lo que sucede.
          </p>
          <p>
            <strong>LiveIt</strong> nace para resolver ese problema: es una aplicación pensada para conectar a las personas con los eventos que realmente les interesan.
          </p>
          <p>
            Aquí puedes encontrar toda la información reunida en un solo lugar, de forma clara, sencilla y actualizada. Ya seas organizador o asistente, LiveIt te ayuda a no perderte nada.
          </p>
          <p>
            Explora lo que tu ciudad tiene para ofrecer. Porque vivir el momento también es estar bien informado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
