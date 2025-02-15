package ups.edu.ec.pie.consumer.consumer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RedisQueueConsumer {

    private final RedisTemplate<String, String> redisTemplate;
    private final String queueName;

    public RedisQueueConsumer(
            RedisTemplate<String, String> redisTemplate,
            @Value("${redis.queue.name}") String queueName) {
        this.redisTemplate = redisTemplate;
        this.queueName = queueName;
    }

    @Scheduled(fixedDelay = 5000)
    public void consumeFromQueue() {
        String message = redisTemplate.opsForList().rightPop("task_queue");
        if (message != null) {
            System.out.println("Processing: " + message);
        }
    }

}
