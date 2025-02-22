package ec.ups.ms.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "telegrafo", groupId = "test-group")
    public void listen(ConsumerRecord<String, String> record) {
        System.out.println("Mensaje recibido: " + record.value());
    }
}
