#ifndef ESTADISTICA_H
#define ESTADISTICA_H

#include <map>
#include <string>
#include <vector>

namespace estadistica {

double calcularMedia(const std::vector<int>& datos);

double calcularMediana(std::vector<int> datos);

std::vector<int> calcularModa(
    const std::vector<int>& datos
);

double calcularVarianza(
    const std::vector<int>& datos
);

double calcularDesviacionEstandar(
    const std::vector<int>& datos
);

std::map<int, int> calcularFrecuencias(
    const std::vector<int>& datos
);

std::string formatearHora(double hora);

}

#endif