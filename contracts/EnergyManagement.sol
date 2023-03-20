// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyManagement {
    
    struct EnergyProducer {
        uint energyProductionCapacity;
        uint energyPrice;
        bool isRegistered;
    }
    
    struct EnergyConsumer {
        uint energyDemand;
        uint energyPrice;
        bool isRegistered;
    }
    
    mapping(address => EnergyProducer) public energyProducers;
    mapping(address => EnergyConsumer) public energyConsumers;
    
    event EnergyProduced(address indexed producer, uint energyProduced);
    event EnergyConsumed(address indexed consumer, uint energyConsumed);
    
    function registerAsProducer(uint capacity, uint price) public {
        energyProducers[msg.sender] = EnergyProducer(capacity, price, true);
    }
    
    function registerAsConsumer(uint demand, uint price) public {
        energyConsumers[msg.sender] = EnergyConsumer(demand, price, true);
    }
    
    function produceEnergy(uint energyProduced) public {
        require(energyProducers[msg.sender].isRegistered, "You are not registered as an energy producer.");
        require(energyProducers[msg.sender].energyProductionCapacity >= energyProduced, "You do not have enough energy production capacity.");
        energyProducers[msg.sender].energyProductionCapacity -= energyProduced;
        emit EnergyProduced(msg.sender, energyProduced);
    }
    
    function consumeEnergy(address producer, uint energyConsumed) public payable {
        require(energyConsumers[msg.sender].isRegistered, "You are not registered as an energy consumer.");
        require(energyProducers[producer].isRegistered, "The selected producer is not registered.");
        require(energyConsumers[msg.sender].energyDemand >= energyConsumed, "You do not have enough energy demand.");
        require(msg.value == energyConsumed * energyProducers[producer].energyPrice, "Insufficient payment.");
        energyConsumers[msg.sender].energyDemand -= energyConsumed;
        payable(producer).transfer(msg.value);
        emit EnergyConsumed(msg.sender, energyConsumed);
    }
    
    function getProducerInfo(address producer) public view returns (uint, uint) {
        return (energyProducers[producer].energyProductionCapacity, energyProducers[producer].energyPrice);
    }
    
    function getConsumerInfo(address consumer) public view returns (uint, uint) {
        return (energyConsumers[consumer].energyDemand, energyConsumers[consumer].energyPrice);
    }
    
}
