#include "../include/Estadistica.h"

#include <algorithm>
#include <cmath>
#include <iomanip>
#include <map>
#include <sstream>

namespace estadistica {

double calcularMedia(
    const std::vector<int>& datos
) {
    if (datos.empty()) {
        return 0.0;
    }

    double suma = 0.0;

    for (int valor : datos) {
        suma += valor;
    }

    return suma / datos.size();
}

double calcularMediana(
    std::vector<int> datos
) {
    if (datos.empty()) {
        return 0.0;
    }

    std::sort(
        datos.begin(),
        datos.end()
    );

    std::size_t cantidad = datos.size();

    if (cantidad % 2 == 0) {
        return (
            datos[cantidad / 2 - 1] +
            datos[cantidad / 2]
        ) / 2.0;
    }

    return datos[cantidad / 2];
}

std::vector<int> calcularModa(
    const std::vector<int>& datos
) {
    std::map<int, int> conteo;

    for (int valor : datos) {
        conteo[valor]++;
    }

    int frecuenciaMayor = 0;

    for (const auto& elemento : conteo) {
        if (elemento.second > frecuenciaMayor) {
            frecuenciaMayor = elemento.second;
        }
    }

    std::vector<int> modas;

    for (const auto& elemento : conteo) {
        if (elemento.second == frecuenciaMayor) {
            modas.push_back(elemento.first);
        }
    }

    return modas;
}

double calcularVarianza(
    const std::vector<int>& datos
) {
    if (datos.empty()) {
        return 0.0;
    }

    double media = calcularMedia(datos);

    double suma = 0.0;

    for (int valor : datos) {
        suma += std::pow(
            valor - media,
            2
        );
    }

    return suma / datos.size();
}

double calcularDesviacionEstandar(
    const std::vector<int>& datos
) {
    return std::sqrt(
        calcularVarianza(datos)
    );
}

std::map<int, int> calcularFrecuencias(
    const std::vector<int>& datos
) {
    std::map<int, int> frecuencias;

    for (int valor : datos) {
        frecuencias[valor]++;
    }

    return frecuencias;
}

std::string formatearHora(
    double hora
) {
    int minutosTotales =
        static_cast<int>(
            std::round(hora * 60)
        );

    minutosTotales %= 1440;

    if (minutosTotales < 0) {
        minutosTotales += 1440;
    }

    int horas = minutosTotales / 60;

    int minutos = minutosTotales % 60;

    std::ostringstream resultado;

    resultado
        << std::setfill('0')
        << std::setw(2)
        << horas
        << ":"
        << std::setw(2)
        << minutos;

    return resultado.str();
}

}