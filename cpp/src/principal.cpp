#include "../include/Estadistica.h"

#include <iostream>
#include <vector>

int main() {

    std::vector<int> datos;

    datos.insert(datos.end(), 8, 22);
    datos.insert(datos.end(), 12, 23);
    datos.insert(datos.end(), 18, 24);
    datos.insert(datos.end(), 16, 25);
    datos.insert(datos.end(), 10, 26);
    datos.insert(datos.end(), 7, 27);
    datos.insert(datos.end(), 4, 28);
    datos.insert(datos.end(), 3, 29);
    datos.insert(datos.end(), 2, 30);

    double media =
        estadistica::calcularMedia(datos);

    double mediana =
        estadistica::calcularMediana(datos);

    std::vector<int> modas =
        estadistica::calcularModa(datos);

    double varianza =
        estadistica::calcularVarianza(datos);

    double desviacion =
        estadistica::calcularDesviacionEstandar(datos);

    std::cout
        << "PERSONAS ENCUESTADAS: "
        << datos.size()
        << "\n\n";

    std::cout
        << "Media: "
        << estadistica::formatearHora(media)
        << '\n';

    std::cout
        << "Mediana: "
        << estadistica::formatearHora(mediana)
        << '\n';

    std::cout
        << "Moda: ";

    for (int moda : modas) {
        std::cout
            << estadistica::formatearHora(moda)
            << " ";
    }

    std::cout << '\n';

    std::cout
        << "Varianza: "
        << varianza
        << '\n';

    std::cout
        << "Desviacion estandar: "
        << desviacion
        << '\n';

    return 0;
}